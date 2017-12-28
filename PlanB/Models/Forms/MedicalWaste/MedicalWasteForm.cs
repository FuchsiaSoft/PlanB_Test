using Markdig;
using PlanB.Models.Forms.Common;
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
            Pages = new List<IPage>()
            {
                new Name(),
                new KasparsPage(),
                new ChrisPage()
            };
        }
    }
}
