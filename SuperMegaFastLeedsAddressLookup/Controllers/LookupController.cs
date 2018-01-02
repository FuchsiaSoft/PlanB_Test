using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperMegaFastLeedsAddressLookup.Controllers
{
    [Route("api/lookup")]
    public class LookupController
    {
        [HttpGet("{postcode}")]
        public IEnumerable<Address> Get(string postcode)
        {
            IEnumerable<Address> addresses =
                AddressManager.Addresses
                .Where(a => a.Postcode.Equals(postcode, StringComparison.InvariantCultureIgnoreCase))
                .OrderBy(o => o.SortPath)
                .ToList();

            return addresses;
        }
    }
}
