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
    public class CustomerType : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [RadioControl(
            Order = 0,
            Question = "What sort of collection is this?",
            HelpTextMarkdown = "Select *Domestic* if this is a " +
            "collection for a person, and *Commercial* if it is " +
            "a collection for a business",
            SourceEnumerablePropertyName = "AvailableCustomerTypes")]
        [Required(ErrorMessage="You must select one option")]
        public string SelectedCustomerType { get; set; }

        [JsonIgnore]
        public string[] AvailableCustomerTypes => new string[]
        {
            "Domestic",
            "Commercial"
        };

        public override Type GetNextPageType(IForm form)
        {
            throw new NotImplementedException();
        }
    }
}
