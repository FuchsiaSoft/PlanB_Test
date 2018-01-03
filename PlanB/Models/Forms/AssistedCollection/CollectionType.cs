using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class CollectionType : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [RadioControl(Order = 0,
            Question = "Do you require permanent or " +
            "temporary help with your collections?",
            SourceEnumerablePropertyName = "AvailableTypes")]
        [Required(ErrorMessage =  "You must choose one option")]
        public string SelectedType { get; set; }

        public string[] AvailableTypes => new string[]
        {
            "Permanent",
            "Temporary"
        };

        public override Type GetNextPageType(IForm form)
        {
            if (SelectedType == "Temporary")
            {
                return typeof(CollectionEndDate);
            }
            else
            {
                return typeof(AbleBodiedPersons);
            }
        }
    }
}
