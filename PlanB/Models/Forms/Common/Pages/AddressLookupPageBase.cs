using Newtonsoft.Json;
using PlanB.Models.Forms.Common.ControlAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PlanB.Models.Forms.Common.Pages
{
    public abstract class AddressLookupPageBase : PageBase
    {
        public bool ForceManualInput { get; set; } = false;
        public string X { get; set; }
        public string Y { get; set; }
        public string Blpu { get; set; }

        [TextBoxControl(
            Order = 0,
            Question = "Address Line 1")]
        [Required(ErrorMessage = "You must provide the first line of an address")]
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
        [Required(ErrorMessage = "You must specify a postcode")]
        public string PostCode { get; set; }

        public string AddressChoice { get; set; }

        //We ignore if null and the controller sets to null on submitting
        //this page action, so the big list doesn't end up in our output
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<AddressModel> AvailableAddresses { get; set; }

        public void GetAddresses()
        {
            try
            {
                WebClient client = new WebClient();
                string response = client.DownloadString
                    ($"http://supermegafastleedsaddresslookup.azurewebsites.net/api/lookup/{PostCode}");

                List<AddressModel> addresses = 
                    JsonConvert.DeserializeObject<List<AddressModel>>(response);

                if (addresses.Count == 0)
                {
                    throw new Exception();
                }

                AvailableAddresses = addresses
                    .OrderBy(o => o.SortPath)
                    .ToArray();
            }
            catch (Exception e)
            {
                ValidationErrors.TryAdd("PostCode", new string[] { "No addresses found for postcode" });
            }
        }
    }
}
