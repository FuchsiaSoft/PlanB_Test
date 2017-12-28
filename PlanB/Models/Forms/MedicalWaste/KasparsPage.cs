using PlanB.Models.Forms.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class KasparsPage : PageBase
    {
        public override string Header => "Yay you said your name was Kaspars";

        protected override string _contentMarkdown => null;

        public override Type GetNextPageType(IForm form)
        {
            return this.GetType();
        }
    }
}
