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

namespace PlanB.Controllers
{
    public class FormsController : Controller
    {

        

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult New(string formName = null)
        {
            if (string.IsNullOrWhiteSpace(formName) ||
                FormRegister.Register.ContainsKey(formName) == false)
            {
                throw new ArgumentException();
            }

            IForm form = FormRegister.Register[formName];
            form.Init();

            HttpContext.Session.LoadAsync().Wait();

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
                InstanceId = strongKey
            };
            
            return View("Form", viewModel);
        }

        private void HandleFormState(IForm form)
        {
            if (!form.HasStarted && !form.AnotherFlag)
            {
                form.HasStarted = true;
                return;
            }

            if (form.HasStarted && !form.AnotherFlag)
            {
                form.AnotherFlag = true;
            }
        }

        [HttpPost]
        public IActionResult MedicalWaste(MedicalWasteForm form)
        {
            return View("Form", form);
        }

        [HttpPost]
        public IActionResult GetPage(MedicalWasteForm model)
        {
            HandleFormState(model);

            

            return View("Form", model);
        }

        [HttpPost]
        public IActionResult Do(FormViewModel model)
        {
            HttpContext.Session.LoadAsync().Wait();

            string formJson = HttpContext.Session.GetString(model.InstanceId);

            IForm form = JsonConvert.DeserializeObject<IForm>(formJson);

            IPage page = form.GetCurrentPage();

            foreach (var propInfo in page.GetType().GetProperties())
            {
                if (Request.Form.ContainsKey(propInfo.Name))
                {
                    string outString = Request.Form[propInfo.Name].ToString();
                    propInfo.SetValue(page, outString);
                }
            }

            form.CheckStateAndGetNextPage();

            model.Form = form;
            
            HttpContext.Session.SetString(model.InstanceId, form.Serialize());

            return View("Page", model);
        }
    }
}