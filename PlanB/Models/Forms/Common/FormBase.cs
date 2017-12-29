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

        [JsonIgnore]
        public virtual string IntroContent => Markdown.ToHtml(_introMarkdownText);

        public bool HasStarted { get; set; } = false;

        public Dictionary<string, IPage> Pages { get; set; }
            = new Dictionary<string, IPage>(StringComparer.OrdinalIgnoreCase);

        public string CurrentPageName { get; set; }

        public abstract void Init();

        public void CheckStateAndGetNextPage()
        {
            IPage currentPage = Pages[CurrentPageName];

            if (currentPage.TryPreSubmit(this))
            {
                Type nextPageType = currentPage.GetNextPageType(this);

                string nextPageName = Pages.First(p => p.Value.GetType() == nextPageType).Key;

                CurrentPageName = nextPageName;
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
            //Just here to abbreviate some syntax in the 
            //razor views
            if (string.IsNullOrWhiteSpace(CurrentPageName))
            {
                return Pages.First().Value;
            }
            else
            {
                return Pages[CurrentPageName];
            }
        }

        public Stack<int> PageIndexHistory { get; set; } = new Stack<int>();
    }
}
