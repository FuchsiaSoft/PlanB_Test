using Newtonsoft.Json;
using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class CollectionType : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [RadioControl(
            Order = 0,
            Question = "Are you requesting a regular or one-off collection?",
            SourceEnumerablePropertyName = "AvailableCollectionTypes")]
        [Required(ErrorMessage = "You must select one option")]
        public string SelectedCollectionType { get; set; }

        [JsonIgnore]
        public string[] AvailableCollectionTypes => new string[] 
        {
            "Regular",
            "One-off"
        };

        public override Type GetNextPageType(IForm form)
        {
            if (SelectedCollectionType == "One-off")
            {
                return typeof(CustomerType);
            }
            else
            {
                return typeof(CollectionStartDate);
            }
        }
    }
}
