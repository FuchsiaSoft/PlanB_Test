using PlanB.Models.Forms.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class ChrisPage : PageBase
    {
        public override string Header => "You are not Kaspars";

        protected override string _contentMarkdown => 
            "If you got here then you " +
            "didn't specify that your name was Kaspars, therefore you " +
            "**MUST** be Chris?";

        public override Type GetNextPageType(IForm form)
        {
            return this.GetType();
        }
    }
}
