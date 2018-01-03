using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class ContactTelephone : PageBase
    {
        [TextBoxControl(Order = 0,
            Question = "What is the contact telephone number for " +
            "this person?")]
        [Required(ErrorMessage = "You must provide a phone number")]
        public string Telephone { get; set; }

        public override Type GetNextPageType(IForm form)
        {
            return typeof(ContactTimesDescription);
        }
    }
}
