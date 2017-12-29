using Markdig;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common
{
    public abstract class PageBase : IPage
    {
        protected abstract string _contentMarkdown { get; }

        public abstract string Header { get; }

        public string Content => Markdown.ToHtml(_contentMarkdown ?? "");

        public string ValidationMessage { get; set; }

        public string ErrorMessage { get; set; }

        public Dictionary<string, string[]> ValidationErrors { get; set; } 
            = new Dictionary<string, string[]>();

        private ValidationContext _validationContext;
        public virtual bool Validate(IForm form)
        {
            ValidationErrors = new Dictionary<string, string[]>();

            if (_validationContext == null) _validationContext = new ValidationContext(this);

            List<ValidationResult> validationResults = new List<ValidationResult>();

            IEnumerable<PropertyInfo> properties = this.GetType().GetProperties()
                .Where(p => p.GetCustomAttributes<ValidationAttribute>().Count() > 0);

            foreach (PropertyInfo property in properties)
            {
                _validationContext.MemberName = property.Name;

                if (!Validator.TryValidateProperty
                    (property.GetValue(this), _validationContext, validationResults))
                {
                    ValidationErrors.Add(property.Name, 
                        validationResults.Select(v => v.ErrorMessage).ToArray());

                    validationResults.Clear();
                }
            }

            if (ValidationErrors.Count == 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public virtual bool TryPreSubmit(IForm form)
        {
            if (Validate(form))
            {
                return true;
            }

            return false;
        }

        public abstract Type GetNextPageType(IForm form);
    }
}
