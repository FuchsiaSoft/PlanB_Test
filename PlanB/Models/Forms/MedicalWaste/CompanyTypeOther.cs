using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class CompanyTypeOther : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [TextBoxControl(Order = 0,
            Question = "Please tell us what kind of business it is?")]
        [Required(ErrorMessage = "You must provide a description")]
        public string Description { get; set; }

        public override Type GetNextPageType(IForm form)
        {
            return typeof(ContainerType);
        }
    }
}
