using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class ContactName : PageBase
    {
        [TextBoxControl(Order = 0,
            Question = "What is the name of the person we should" +
            " contact regarding this collection?",
            HelpTextMarkdown = "Please enter the name in full as the " +
            "person would prefer to be addressed.")]
        [Required(ErrorMessage  = "You must provide a name")]
        public string Name { get; set; }


        public override Type GetNextPageType(IForm form)
        {
            return typeof(ContactTelephone);
        }
    }
}
