using Markdig;
using Microsoft.AspNetCore.Html;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common
{
    public abstract class FormBase : IForm
    {
        protected abstract string _introMarkdownText { get; }

        public abstract string FriendlyName { get; }

        public virtual string CategoryTittle { get; } = "General";

        public virtual string CategoryDescription { get; } = String.Empty;

        public virtual int CategoryId { get; } = -1;

        public virtual string IntroContent => Markdown.ToHtml(_introMarkdownText);

        public bool HasStarted { get; set; } = false;

        public bool AnotherFlag { get; set; } = false;

        public List<IPage> Pages { get; set; }

        public int CurrentPageIndex { get; set; }

        public virtual void Init()
        {
            
        }

        public void CheckStateAndGetNextPage()
        {
            IPage currentPage = Pages[CurrentPageIndex];

            if (currentPage.TryPreSubmit(this))
            {
                Type nextPageType = currentPage.GetNextPageType(this);

                CurrentPageIndex = Pages.FindIndex(p => p.GetType() == nextPageType);
            }
        }

        public virtual string Serialize()
        {
            string result = JsonConvert.SerializeObject(this, Formatting.None, new JsonSerializerSettings()
            {
                TypeNameHandling = TypeNameHandling.All
            });

            return result;
        }

        public IPage GetCurrentPage()
        {
            return Pages[CurrentPageIndex];
        }
    }
}
