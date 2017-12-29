using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common
{
    public interface IForm
    {
        string CategoryTittle { get; }

        string CategoryDescription { get; }

        int CategoryId { get; }

        string FriendlyName { get; }

        string IntroContent { get; }

        bool HasStarted { get; set; }

        bool AnotherFlag { get; set; }

        List<IPage> Pages { get; set; }

        int CurrentPageIndex { get; set; }

        void Init();

        void CheckStateAndGetNextPage();

        string Serialize();

        IPage GetCurrentPage();
    }
}
