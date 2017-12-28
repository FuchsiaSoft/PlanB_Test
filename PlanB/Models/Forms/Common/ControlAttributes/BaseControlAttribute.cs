using Markdig;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common.ControlAttributes
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class BaseControlAttribute : Attribute
    {
        public string Question { get; set; }
        public string HelpTextMarkdown { get; set; }
        public string HelpText => Markdown.ToHtml(HelpTextMarkdown ?? "");
        public int Order { get; set; }
    }
}
