using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class CollectionReason : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [RadioControl(Order =0,
            Question = "Why do you require help with your bin?",
            HelpTextMarkdown = "(Incapcity refers to short term " +
            "illness and recuperation etc.)",
            SourceEnumerablePropertyName = "AvailableReasons")]
        [Required(ErrorMessage = "You must choose a reason")]
        public string SelectedReason { get; set; }

        public string[] AvailableReasons => new string[]
        {
            "Frail",
            "Disabled",
            "Incapacity",
            "Mental health difficulties"
        };

        public override Type GetNextPageType(IForm form)
        {
            return typeof(CollectionType);
        }
    }
}
