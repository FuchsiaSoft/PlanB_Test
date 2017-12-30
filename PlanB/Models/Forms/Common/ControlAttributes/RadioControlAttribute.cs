using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common.ControlAttributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class RadioControlAttribute : BaseControlAttribute
    {
        public string SourceEnumerablePropertyName { get; set; }
    }
}
