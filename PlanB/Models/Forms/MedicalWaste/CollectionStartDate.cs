using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class CollectionStartDate : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [DateControl(Order = 0,
            Question = "When would you like your collections to start?",
            HelpTextMarkdown = "You must choose a date at least **10 days from now**")]
        [Required(ErrorMessage="You must specify a date")]
        [CustomValidation(typeof(CollectionStartDate), "ValidateDate")]
        public DateTime? StartDate { get; set; }

        public override Type GetNextPageType(IForm form)
        {
            return typeof(CustomerType);
        }

        public static ValidationResult ValidateDate(DateTime date)
        {
            if ((date - DateTime.Today).TotalDays < 10)
            {
                return new ValidationResult("Date must be at least 10 days from today");
            }
            else
            {
                return ValidationResult.Success;
            }
        }
    }
}
