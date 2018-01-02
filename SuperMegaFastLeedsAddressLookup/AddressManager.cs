using CsvHelper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SuperMegaFastLeedsAddressLookup
{
    public static class AddressManager
    {
        public static List<Address> Addresses { get; } = GetAddress();

        private static List<Address> GetAddress()
        {
            using (TextReader textReader = File.OpenText("Data\\AddressData.csv"))
            using (CsvReader reader = new CsvReader(textReader))
            {
                return reader.GetRecords<Address>().ToList();
            }
        }
    }
}
