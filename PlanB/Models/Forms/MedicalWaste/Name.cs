﻿using PlanB.Models.Forms.Common;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.MedicalWaste
{
    public class Name : PageBase
    {
        public override string Header => null;

        protected override string _contentMarkdown => null;

        [TextBoxControl(
            Order = 0,
            Question = "What is your name?",
            HelpTextMarkdown = "Enter your name below however you" +
            "want it to appear on correspondence")]
        public string CustomerName { get; set; }

        public override Type GetNextPageType(IForm form)
        {
            if (string.IsNullOrWhiteSpace(CustomerName))
            {
                return this.GetType();
            }
            else
            {
                if (CustomerName == "Kaspars")
                {
                    return typeof(KasparsPage);
                }
                else
                {
                    return typeof(ChrisPage);
                }
            }
        }
    }
}
