using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PlanB.Models.Forms;

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
            List<FormsList> formsList = new List<FormsList>();
            foreach (var registeredForm in FormRegister.Register)
            {
                formsList.Add(new FormsList
                {
                    FormTittle = registeredForm.Value.FriendlyName,
                    FormUrl = registeredForm.Key,
                    AssociatedCategoryId = registeredForm.Value.CategoryId.ToString()
                });
            }
            formsList.OrderBy(x => x.FormTittle).ToList();
            return formsList;
        }
        #endregion
        //END OF CREATE LIST OF FORMS FOR LEVEL 2 PAGE
    }
}
