using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models
{
    public class FormsViewModel
    {
        //BLUEPRINT FOR AVAILIBLE FORMS LIST
        #region Forms BluePrint
        public class FormsList
        {
            public string FormTittle { get; set; }
            public string FormUrl { get; set; }
            public string AssociatedCategoryId { get; set; }
        }
        #endregion
        //END OF BLUEPRINT FOR AVAILIBLE FORMS LIST

        //CREATE LIST OF FORMS FOR LEVEL 2 PAGE
        #region Generate Available Forms as List
        public static List<FormsList> CreateAvailableFormsList()
        {
            List<FormsList> formsList = new List<FormsList>
            {
                new FormsList
                {
                    FormTittle = "MedicalWaste Form",
                    FormUrl = @"\New('MedicalWaste')",
                    AssociatedCategoryId = "1"
                },

                new FormsList
                {
                    FormTittle = "TEST Form",
                    FormUrl = @"\New(MedicalWaste)",
                    AssociatedCategoryId = "2"
                }
            };
            return formsList;
        }
        #endregion
        //END OF CREATE LIST OF FORMS FOR LEVEL 2 PAGE
    }
}
