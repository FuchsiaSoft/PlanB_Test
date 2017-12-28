using Markdig;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common
{
    public abstract class PageBase : IPage
    {
        protected abstract string _contentMarkdown { get; }

        public abstract string Header { get; }

        public string Content => Markdown.ToHtml(_contentMarkdown);

        public string ValidationMessage { get; set; }

        public string ErrorMessage { get; set; }

        public virtual bool Validate(IForm form)
        {
            //do some validation here
            return true;
        }

        public virtual bool TryPreSubmit(IForm form)
        {
            if (Validate(form))
            {
                return true;
            }

            return false;
        }

        public abstract Type GetNextPageType(IForm form);
    }
}
