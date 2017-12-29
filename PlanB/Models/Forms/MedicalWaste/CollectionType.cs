using Newtonsoft.Json;
using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
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
        public string SelectedCollectionType { get; set; }

        [JsonIgnore]
        public string[] AvailableCollectionTypes => new string[] 
        {
            "Regular",
            "One-off"
        };

        public override Type GetNextPageType(IForm form)
        {
            throw new NotImplementedException();
        }
    }
}
