using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class CompanyName : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [TextBoxControl(Order = 0,
            Question = "What is the name of the company?")]
        [Required(ErrorMessage = "You must specify the company name")]
        public string Name { get; set; }

        public override Type GetNextPageType(IForm form)
        {
            return typeof(CompanyType);
        }
    }
}
