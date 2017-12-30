using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common.Pages
{
    public abstract class PropertyAddressBase : PageBase
    {
        [TextBoxControl(
            Order = 0,
            Question = "Address Line 1")]
        [Required(ErrorMessage="You must provide the first line of an address")]
        public string AddressLineOne { get; set; }

        [TextBoxControl(
            Order = 1,
            Question = "Address Line 2")]
        public string AddressLineTwo { get; set; }

        [TextBoxControl(
            Order = 2,
            Question = "Address Line 3")]
        public string AddressLineThree { get; set; }

        [TextBoxControl(
            Order = 3,
            Question = "City")]
        public string City { get; set; }

        [TextBoxControl(
            Order = 4,
            Question = "County")]
        public string County { get; set; }

        [TextBoxControl(
            Order = 5,
            Question = "Postcode")]
        [Required(ErrorMessage="You must specify a postcode")]
        public string PostCode { get; set; }
    }
}
