using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class CollectionEndDate : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [DateControl(Order = 0,
            Question = "When do you want the help to end?")]
        [Required(ErrorMessage = "You must specify a date")]
        [CustomValidation(typeof(CollectionEndDate), "ValidateDate")]
        public DateTime? EndDate { get; set; }

        public override Type GetNextPageType(IForm form)
        {
            return typeof(AbleBodiedPersons);
        }

        public static ValidationResult ValidateDate(DateTime date)
        {
            if (date.Date <= DateTime.Today.Date)
            {
                return new ValidationResult("Date must be in the future");
            }
            else
            {
                return ValidationResult.Success;
            }
        }
    }
}
