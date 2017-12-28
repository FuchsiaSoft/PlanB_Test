using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlanB.Models.Forms;
using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.MedicalWaste;

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

            

            return View("Form", form);
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
        public IActionResult Do(string formInstanceId)
        {
            throw new NotImplementedException();
        }
    }
}