using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlanB.Models;

namespace PlanB.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Categories()
        {
            //SET BASIC DISPLAY INFORMATION 
            ViewBag.Title = "Do It Online";
            ViewBag.MessageHeader = "Categories";
            ViewBag.Message = "This is internal council's 'Do It Online' site prototype. This site is meant to be hosting multiple self service forms.";

            //GENERATE LIST OF CATEGORIES TO DISPLAY
            List<CategoriesViewModel.CategoriesList> categoriesList = new List<CategoriesViewModel.CategoriesList>();
            categoriesList = CategoriesViewModel.CreateCategoriesList();
            ViewBag.CategoriesList = categoriesList;

            //PRESENT VIEW
            return View();
        }

        public IActionResult Forms(string id)
        {
            //CHECK PARAMETER FOR NAVIGATION
            if (id == null)
            {
                //EXECUTE REDIRECT ACTION TO NEXT CONTROLLER/VIEW
                return this.RedirectToAction("Categories", "Home");
            }

            //SET VIEW SPECIFIC VARIABLES
            List<CategoriesViewModel.CategoriesList> selectedCategory = new List<CategoriesViewModel.CategoriesList>();
            selectedCategory = CategoriesViewModel.CreateCategoriesList().Where(x => x.CategoryId == id).ToList();
            ViewBag.Title = selectedCategory.FirstOrDefault().CategoryTittle;
            ViewBag.Message = selectedCategory.FirstOrDefault().CategoryDescription;
            ViewBag.MessageHeader = "Forms";

            //GENERATE LIST OF FORMS FOR SELECTED CATEGORY 
            List<FormsViewModel.FormsList> availableFormsList = new List<FormsViewModel.FormsList>();
            availableFormsList = FormsViewModel.CreateAvailableFormsList();
            ViewBag.AvailableFormsList = availableFormsList.Where(x => x.AssociatedCategoryId == id).ToList();

            //PRESENT VIEW
            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
