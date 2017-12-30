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
    public class CompanyType : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [RadioControl(Order = 0 ,
            Question = "What is the nature of the business?",
            HelpTextMarkdown = "If your company does not fall into one " +
            "of these categories, select *Other* and provide " +
            "a description on the next page",
            SourceEnumerablePropertyName = "AvailableCompanyTypes")]
        [Required(ErrorMessage = "You must choose one option")]
        public string SelectedCompanyType { get; set; }

        [JsonIgnore]
        public string[] AvailableCompanyTypes => new string[]
        {
            "Dental",
            "Health Centre",
            "Clinic",
            "Tattooing",
            "Cosmetics",
            "Other"
        };

        public override Type GetNextPageType(IForm form)
        {
            if (SelectedCompanyType == "Other")
            {
                return typeof(CompanyTypeOther);
            }
            else
            {
                return typeof(ContainerType);
            }
        }
    }
}
