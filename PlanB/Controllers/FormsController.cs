using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlanB.Models.Forms;
using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.MedicalWaste;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Reflection;
using PlanB.Models.Forms.Common.ControlAttributes;
using PlanB.Models.Forms.Common.Pages;

namespace PlanB.Controllers
{
    public class FormsController : Controller
    {

        [HttpGet]
        [Route("Forms/{form}/{page}")]
        public IActionResult Index()
        {
            var data = RouteData;

            string instanceId = string.Empty;

            //TODO: need to handle this better, kind of undermines the whole
            //instance id concept
            if (TempData["PostInstanceId"] == null)
            {
                if (TempData["GetInstanceId"] == null)
                {
                    return RedirectToAction(RouteData.Values["form"].ToString());
                }
                else
                {
                    instanceId = TempData["GetInstanceId"] as string;

                    string formJson = HttpContext.Session.GetString(instanceId);

                    IForm form = JsonConvert.DeserializeObject<IForm>(formJson);

                    form.CurrentPageName = RouteData.Values["page"] as string;

                    HttpContext.Session.SetString(instanceId, form.Serialize());

                    FormViewModel viewModel = new FormViewModel()
                    {
                        Form = form,
                        InstanceId = instanceId,
                        FormRegisterKey = RouteData.Values["form"] as string
                    };

                    TempData["GetInstanceId"] = instanceId;

                    return View("Page", viewModel);
                }
            }
            else
            {
                instanceId = TempData["PostInstanceId"] as string;

                string formJson = HttpContext.Session.GetString(instanceId);

                IForm form = JsonConvert.DeserializeObject<IForm>(formJson);

                FormViewModel viewModel = new FormViewModel()
                {
                    Form = form,
                    InstanceId = instanceId,
                    FormRegisterKey = TempData["FormName"] as string
                };

                TempData["GetInstanceId"] = instanceId;

                return View("Page", viewModel);
            }

            
        }

        [HttpGet]
        [Route("Forms/{form}")]
        public IActionResult New()
        {
            string formName = RouteData.Values["form"].ToString();
            if (string.IsNullOrWhiteSpace(formName) ||
                FormRegister.Register.ContainsKey(formName) == false)
            {
                return View("Index");
            }

            IForm form = (IForm)Activator.CreateInstance(FormRegister.Register[formName]);
            form.Init();

            HttpContext.Session.LoadAsync().Wait();

            //We don't want to store the form data straight into the session
            //as this exposes problems for shared computers and whatnot.
            //So instead we pass around a crypto strong number whilst the form
            //is in progress.  This means that if the user closes the browser
            //window then any subsequent requests will get a new key and
            //therefore a new form entry even if using the same session ID

            string strongKey = string.Empty;

            using (var rnd = RandomNumberGenerator.Create())
            {
                //It's super unlikely that we'll get the same ulong
                //out of secure random, but just in case...
                do
                {
                    byte[] bytes = new byte[8];
                    rnd.GetNonZeroBytes(bytes);
                    ulong number = BitConverter.ToUInt64(bytes, 0);
                    strongKey = number.ToString("X2");
                } while (HttpContext.Session.Keys.Contains(strongKey));

                HttpContext.Session.SetString(strongKey, form.Serialize());
            }

            FormViewModel viewModel = new FormViewModel()
            {
                Form = form,
                InstanceId = strongKey,
                FormRegisterKey = formName
            };

            return View("Form", viewModel);
        }

        [HttpPost]
        public IActionResult Start(FormViewModel model)
        {
            HttpContext.Session.LoadAsync().Wait();

            string formJson = HttpContext.Session.GetString(model.InstanceId);
            IForm form = JsonConvert.DeserializeObject<IForm>(formJson);
            form.CurrentPageName = form.Pages.First().Key;

            //serialize it for next POST
            HttpContext.Session.SetString(model.InstanceId, form.Serialize());

            //hold it in temp data only for the GET redirect
            TempData["PostInstanceId"] = model.InstanceId;
            TempData["FormName"] = model.FormRegisterKey;

            string firstPageName = form.Pages.First().Key;
            string formName = model.FormRegisterKey;

            return RedirectToAction("Index", "Forms", new { form = formName, page = firstPageName });
        }

        [HttpPost]
        public IActionResult Do(FormViewModel model)
        {
            HttpContext.Session.LoadAsync().Wait();

            string formJson = HttpContext.Session.GetString(model.InstanceId);
            IForm form = JsonConvert.DeserializeObject<IForm>(formJson);
            IPage page = form.GetCurrentPage();

            PutRequestDataInPage(page);

            form.CheckStateAndGetNextPage();

            //serialize it for next POST
            HttpContext.Session.SetString(model.InstanceId, form.Serialize());

            if (form.GetCurrentPage().GetType() == typeof(ConfirmationPage))
            {
                ViewData["Ref"] = model.InstanceId;
                return View("Confirmation");
            }

            //hold it in temp data only for the GET redirect
            TempData["PostInstanceId"] = model.InstanceId;
            TempData["FormName"] = model.FormRegisterKey;

            string nextPageName = form.CurrentPageName;
            string formName = model.FormRegisterKey;

            return RedirectToAction("Index", "Forms", new { form = formName, page = nextPageName });
        }


        private void PutRequestDataInPage(IPage page)
        {
            foreach (var propInfo in page.GetType().GetProperties()
                            .Where(p => p.GetCustomAttributes()
                            .Any(a => a.GetType().BaseType == typeof(BaseControlAttribute))))
            {
                if (propInfo.PropertyType == typeof(string))
                {
                    if (Request.Form.ContainsKey(propInfo.Name))
                    {
                        string outString = Request.Form[propInfo.Name].ToString();
                        propInfo.SetValue(page, outString);
                    }
                    continue;
                }

                if (propInfo.PropertyType == typeof(DateTime?) &&
                    propInfo.GetCustomAttributes<DateControlAttribute>().Count() > 0)
                {
                    //there should be correponding dd,mm,yy elements but 
                    //need to check in case people spoofed etc.
                    if (Request.Form.ContainsKey(propInfo.Name + "-dd") &&
                        Request.Form.ContainsKey(propInfo.Name + "-mm") &&
                        Request.Form.ContainsKey(propInfo.Name + "-yy"))
                    {
                        if (int.TryParse(Request.Form[propInfo.Name + "-dd"], out int day) &&
                            int.TryParse(Request.Form[propInfo.Name + "-mm"], out int month) &&
                            int.TryParse(Request.Form[propInfo.Name + "-yy"], out int year))
                        {
                            try
                            {
                                //just in case someone puts something like 31st Feb in,
                                //because DateTime constructor will roll over excess
                                //days and months.. so we need to make sure the newly
                                //constructed datetime is actually the same as the
                                //values that went into its constructor... JOSH!
                                DateTime date = new DateTime(year, month, day);
                                if (date.Day == day && date.Month == month && date.Year == year)
                                {
                                    propInfo.SetValue(page, date);
                                }
                            }
                            catch (Exception) { }
                        }
                    }
                }

            }

            if (page.GetType().IsSubclassOf(typeof(AddressLookupPageBase)))
            {
                var addressPage = page as AddressLookupPageBase;
                if (addressPage.AvailableAddresses != null &&
                    Request.Form.ContainsKey("AddressChoice") && 
                    addressPage.AvailableAddresses.Any(a=>a.Address1 == Request.Form["AddressChoice"]))
                {
                    var selectedAddress = addressPage.AvailableAddresses
                        .First(a => a.Address1 == Request.Form["AddressChoice"]);

                    addressPage.AddressLineOne = selectedAddress.Address1;
                    addressPage.AddressLineThree = selectedAddress.Locality;
                    addressPage.City = selectedAddress.Town;
                    addressPage.County = selectedAddress.County;
                    addressPage.Blpu = selectedAddress.Blpu;
                    addressPage.X = selectedAddress.X;
                    addressPage.Y = selectedAddress.Y;

                    //Needed so that the list of available addresses doesn't
                    //persist in our output
                    addressPage.AvailableAddresses = null;
                }
            }
        }

        [HttpPost]
        public IActionResult LookupAddress(FormViewModel model)
        {
            //Don't need to do much here apart from store the updated form page and
            //bounce it to the GET, as page.cshtml does all the rendering
            HttpContext.Session.LoadAsync().Wait();

            string formJson = HttpContext.Session.GetString(model.InstanceId);
            IForm form = JsonConvert.DeserializeObject<IForm>(formJson);
            IPage page = form.GetCurrentPage();

            if (page.GetType().IsSubclassOf(typeof(AddressLookupPageBase)))
            {
                PutRequestDataInPage(page);
                ((AddressLookupPageBase)page).GetAddresses();

                HttpContext.Session.SetString(model.InstanceId, form.Serialize());

                TempData["PostInstanceId"] = model.InstanceId;
                TempData["FormName"] = model.FormRegisterKey;

                string nextPageName = form.CurrentPageName;
                string formName = model.FormRegisterKey;

                return RedirectToAction("Index", "Forms", new { form = formName, page = nextPageName });
            }

            return null;
        }

        [HttpPost]
        public IActionResult ForceManual(FormViewModel model)
        {
            //Don't need to do much here apart from store the updated form page and
            //bounce it to the GET, as page.cshtml does all the rendering
            HttpContext.Session.LoadAsync().Wait();

            string formJson = HttpContext.Session.GetString(model.InstanceId);
            IForm form = JsonConvert.DeserializeObject<IForm>(formJson);
            IPage page = form.GetCurrentPage();

            if (page.GetType().IsSubclassOf(typeof(AddressLookupPageBase)))
            {
                PutRequestDataInPage(page);
                ((AddressLookupPageBase)page).ForceManualInput = true;

                //clear any spurious validation errors they saw before
                //going for a manual input
                page.ValidationErrors.Clear();

                HttpContext.Session.SetString(model.InstanceId, form.Serialize());

                TempData["PostInstanceId"] = model.InstanceId;
                TempData["FormName"] = model.FormRegisterKey;

                string nextPageName = form.CurrentPageName;
                string formName = model.FormRegisterKey;

                return RedirectToAction("Index", "Forms", new { form = formName, page = nextPageName });
            }

            return null;
        }

    }
}