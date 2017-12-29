using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common
{
    public class FormViewModel
    {
        public string FormRegisterKey { get; set; }
        public string InstanceId { get; set; }
        public IForm Form { get; set; }
    }
}
