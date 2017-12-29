using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.MedicalWaste;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms
{
    public static class FormRegister
    {
        public static IDictionary<string, Type> Register { get; private set; }
            = new Dictionary<string, Type>(StringComparer.InvariantCultureIgnoreCase)
            {
                { "MedicalWaste", typeof(MedicalWasteForm) },

            };


    }
}
