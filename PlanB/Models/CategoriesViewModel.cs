using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PlanB.Models.Forms;

namespace PlanB.Models
{
    public class CategoriesViewModel
    {
        //BLUEPRINT FOR CATEGORIES
        #region Categories BluePrint
        public class CategoriesList
        {
            public string CategoryTittle { get; set; }
            public string CategoryDescription { get; set; }
            public string CategoryId { get; set; }
        }
        #endregion
        //END OF BLUEPRINT FOR CATEGORIES

        //CREATE CATEGORIES FOR LEVEL 1 PAGE
        #region GenererateCategoriesList
        public static List<CategoriesList> CreateCategoriesList()
        {
            List<CategoriesList> categoriesList = new List<CategoriesList>();
            foreach (var registeredForm in FormRegister.Register)
            {
                categoriesList.Add(new CategoriesList
                {
                    CategoryTittle = registeredForm.Value.CategoryTittle,
                    CategoryDescription = registeredForm.Value.CategoryDescription,
                    CategoryId = registeredForm.Value.CategoryId.ToString()
                });
            }
            categoriesList.OrderBy(x => x.CategoryTittle).ToList();
            return categoriesList;
        }
        #endregion
        //END OF CREATE CATEGORIES FOR LEVEL 1 PAGE
    }
}
