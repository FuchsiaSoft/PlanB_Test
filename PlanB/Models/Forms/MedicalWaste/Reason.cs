using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using PlanB.Models.Forms.Common.Pages;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class Reason : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [TextAreaControl(Order = 0,
            Question = "What is the reason for the collection?",
            HelpTextMarkdown = "Please tell us briefly why the collection " +
            "is required, including the type of waste involved")]
        [Required]
        public string CollectionReason { get; set; }

        public override Type GetNextPageType(IForm form)
        {
            return typeof(ConfirmationPage);
        }
    }
}
