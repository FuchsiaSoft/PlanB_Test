using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            List<CategoriesList> categoriesList = new List<CategoriesList>
            {
                new CategoriesList
                {
                    CategoryTittle = "Waste & Recycling",
                    CategoryDescription = "Forms and links for 'Waste & Recycling'",
                    CategoryId = "1"
                },
                new CategoriesList
                {
                    CategoryTittle = "TEST Category",
                    CategoryDescription = "TEST Category description",
                    CategoryId = "2"
                }
            };
            return categoriesList;
        }
        #endregion
        //END OF CREATE CATEGORIES FOR LEVEL 1 PAGE
    }
}
