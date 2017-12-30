using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common.Pages
{
    public class ConfirmationPage : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        public override Type GetNextPageType(IForm form)
        {
            throw new NotImplementedException();
        }
    }
}
