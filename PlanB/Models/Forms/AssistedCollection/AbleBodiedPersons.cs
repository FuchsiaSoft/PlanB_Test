using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class AbleBodiedPersons : PageBase
    {
        [DropDownControl(Order = 0,
            Question = "How many able-bodied occupants at " +
            "the property are able to present the bin " +
            "for collection?",
            SourceArrayMethodName = "AvailableCounts")]
        [Required(ErrorMessage = "You must choose an option")]
        [RegularExpression("0",
            ErrorMessage = "We cannot provide assisted collections " +
            "if there are able-bodied occupants at the property")]
        public string SelectedCount { get; set; }

        public string[] AvailableCounts() => new string[]
        {
            "0","1","2","3","4","5",">5"
        };
        public override Type GetNextPageType(IForm form)
        {
            return typeof(PropertySteps);
        }
    }
}
