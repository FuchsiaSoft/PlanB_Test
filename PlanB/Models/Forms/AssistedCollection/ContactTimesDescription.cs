using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using PlanB.Models.Forms.Common.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class ContactTimesDescription : PageBase
    {
        [TextAreaControl(Order = 0,
            Question = "(Optional) Please tell us when is the best time " +
            "to contact this person?")]
        public string TimeNotes { get; set; }


        public override Type GetNextPageType(IForm form)
        {
            return typeof(ConfirmationPage);
        }
    }
}
