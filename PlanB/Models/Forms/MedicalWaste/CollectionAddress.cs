using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class CollectionAddress : PropertyAddressBase
    {
        public override string Header => "What is the address?";

        protected override string _contentMarkdown => "This should be the address that " +
            "you want the waste to be **collected from**, even if it is different " +
            "from your home address";

        public override Type GetNextPageType(IForm form)
        {
            return typeof(CollectionType);
        }
    }
}
