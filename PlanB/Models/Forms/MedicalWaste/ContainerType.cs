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
    public class ContainerType : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [RadioControl(Order = 0,
            Question = "What type of container is it?",
            SourceEnumerablePropertyName = "AvailableContainerTypes")]
        [Required(ErrorMessage = "You must choose one option")]
        public string SelectedContainerType { get; set; }

        [JsonIgnore]
        public string[] AvailableContainerTypes => new string[]
        {
            "Sharps Container",
            "Orange Bag",
            "Yellow Tiger Bag",
            "Other"
        };

        public override Type GetNextPageType(IForm form)
        {
            return typeof(Reason);
        }
    }
}
