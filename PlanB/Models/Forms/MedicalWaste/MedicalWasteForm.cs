using Markdig;
using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.Pages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class MedicalWasteForm : FormBase
    {
        public override string FriendlyName => "Request a medical waste collection";

        protected override string _introMarkdownText =>
            "Please use this form to request a medical waste collection.\n\n" +
            "**Important:** There are restrictions on what items we can take on this service.\n\n" +
            "Please visit our [Medical waste page](http://www.leeds.gov.uk/residents/Pages/MedicalWaste.aspx) " +
            "and read the information before completing this form.";
        

        public override void Init()
        {
            Pages.Add("Name", new Name());
            Pages.Add("Collection-Address", new CollectionAddress());
            Pages.Add("Collection-Type", new CollectionType());
            Pages.Add("Collection-Start-Date", new CollectionStartDate());
            Pages.Add("Customer-Type", new CustomerType());
            Pages.Add("Collection-Reason", new Reason());
            Pages.Add("Company-Name", new CompanyName());
            Pages.Add("Company-Type", new CompanyType());
            Pages.Add("Company-Type-Other", new CompanyTypeOther());
            Pages.Add("Container-Type", new ContainerType());
            Pages.Add("Confirmation-Page", new ConfirmationPage());
        }
    }
}
