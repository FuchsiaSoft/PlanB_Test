using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common.ControlAttributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class DropDownControlAttribute : BaseControlAttribute
    {
        public string SourceArrayMethodName { get; set; }
    }
}
