using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class AssistedWasteCollectionForm : FormBase
    {
        public override string FriendlyName => "Request an assisted waste collection";

        protected override string _introMarkdownText =>
            "Please use this form to apply for help with putting your bins out\n\n" +
            "This type of collection is solely aimed at frail / elderly / disabled " +
            "/ incapacitated persons where there are no able bodied residents to " +
            "present the wheeled bin to the kerbside.\n\n" +
            "If an application is made on behalf of another person (e.g. an elderly " +
            "relative) the questions in the form will relate specifically to the person " +
            "for whom the application is made.\n\n" +
            "If you are moving home and wish to receive help with your bin at your new " +
            "property you will need to make a new application using this form.  You must " +
            "cancel the help you receive at your old property.\n\n";

        public override void Init()
        {
            Pages.Add("collection-address", new CollectionAddress());
            Pages.Add("collection-reason", new CollectionReason());
            Pages.Add("collection-type", new CollectionType());
            Pages.Add("other-residents", new AbleBodiedPersons());
            Pages.Add("end-date", new CollectionEndDate());
            Pages.Add("steps", new PropertySteps());
            Pages.Add("contact-name", new ContactName());
            Pages.Add("contact-tel", new ContactTelephone());
            Pages.Add("contact-times", new ContactTimesDescription());
            Pages.Add("confirmation-page", new ConfirmationPage());
        }
    }
}
