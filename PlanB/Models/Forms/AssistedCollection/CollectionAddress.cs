using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.AssistedCollection
{
    public class CollectionAddress : AddressLookupPageBase
    {
        public override string Header => "What is the address that requires an assisted collection?";
        public override Type GetNextPageType(IForm form)
        {
            return typeof(CollectionReason);
        }
    }
}
