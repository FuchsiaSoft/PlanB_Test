using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using PlanB.Models.Forms.Common.Pages;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class PropertySteps : PageBase
    {
        [RadioControl(Order = 0,
            Question = "When wheeling the bin our for collection " +
            "does the bin need to go up or down three or more steps?",
            SourceEnumerablePropertyName = "AvailableOptions")]
        [Required(ErrorMessage = "You must select an option")]
        public string SelectedOption { get; set; }

        public string[] AvailableOptions => new string[]
        {
            "Yes","No"
        };

        public override Type GetNextPageType(IForm form)
        {
            if (SelectedOption == "Yes")
            {
                return typeof(ContactName);
            }
            else
            {
                return typeof(ConfirmationPage);
            }
        }
    }
}
