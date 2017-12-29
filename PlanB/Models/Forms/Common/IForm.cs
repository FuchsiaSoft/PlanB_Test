using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common
{
    public interface IForm
    {
        string FriendlyName { get; }

        string IntroContent { get; }

        bool HasStarted { get; set; }

        Dictionary<string, IPage> Pages { get; set; }

        string CurrentPageName { get; set; }

        void Init();

        void CheckStateAndGetNextPage();

        string Serialize();

        IPage GetCurrentPage();

        Stack<int> PageIndexHistory { get; set; }
    }
}
