using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common
{
    public interface IPage
    {
        string Header { get; }

        string Content { get; }

        string ValidationMessage { get; set; }

        string ErrorMessage { get; set; }

        bool Validate(IForm form);

        bool TryPreSubmit(IForm form);

        Type GetNextPageType(IForm form);

        Dictionary<string, string[]> ValidationErrors { get; set; }
    }
}
