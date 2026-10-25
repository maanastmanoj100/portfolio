import assert from "node:assert/strict";
import test from "node:test";
import {
  cveDetailUrl,
  formatCvssScore,
  normalizeCveId,
  normalizeNvdResponse,
  parseCveRecord,
  primaryMetric,
  severityFromScore,
} from "../../lib/portfolio/cve";

/**
 * CVE normalisation.
 *
 * The NVD response is untrusted input: it is fetched from a third party, so
 * every field is narrowed before the UI sees it. These tests cover the
 * validation boundary as well as the happy path.
 */

const PAYLOAD = {
  resultsPerPage: 1,
  startIndex: 0,
  totalResults: 1,
  vulnerabilities: [
    {
      cve: {
        id: "CVE-2021-44228",
        vulnStatus: "Analyzed",
        published: "2021-12-10T10:15:09.143",
        lastModified: "2023-11-06T20:15:36.910",
        descriptions: [
          { lang: "es", value: "Descripción en español." },
          {
            lang: "en",
            value:
              "Apache Log4j2 2.0-beta9 through 2.15.0 JNDI features used in configuration do not protect against attacker controlled LDAP.",
          },
        ],
        metrics: {
          cvssMetricV31: [
            {
              source: "nvd@nist.gov",
              type: "Primary",
              cvssData: {
                version: "3.1",
                vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
                baseScore: 10.0,
                baseSeverity: "CRITICAL",
              },
            },
          ],
          cvssMetricV2: [
            {
              source: "nvd@nist.gov",
              type: "Primary",
              cvssData: { version: "2.0", vectorString: "AV:N/AC:L/Au:N/C:C/I:C/A:C", baseScore: 9.3 },
              baseSeverity: "HIGH",
            },
          ],
        },
        weaknesses: [
          {
            source: "nvd@nist.gov",
            type: "Primary",
            description: [
              { lang: "en", value: "CWE-502" },
              { lang: "en", value: "CWE-400" },
              { lang: "en", value: "not-a-cwe" },
            ],
          },
        ],
        configurations: [
          {
            nodes: [
              {
                operator: "OR",
                cpeMatch: [
                  {
                    vulnerable: true,
                    criteria: "cpe:2.3:a:apache:log4j:*:*:*:*:*:*:*:*",
                    versionEndIncluding: "2.15.0",
                  },
                  {
                    vulnerable: false,
                    criteria: "cpe:2.3:a:apache:log4j:2.16.0:*:*:*:*:*:*:*",
                  },
                ],
                children: [
                  {
                    operator: "AND",
                    cpeMatch: [
                      {
                        vulnerable: true,
                        criteria: "cpe:2.3:a:apache:log4j:2.0:beta9:*:*:*:*:*:*",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        references: [
          { url: "https://logging.apache.org/log4j/2.x/security.html", source: "vendor", tags: ["Vendor Advisory"] },
          { url: "javascript:alert(1)", source: "bad", tags: [] },
          { url: "not a url", source: "bad", tags: [] },
          { url: "https://logging.apache.org/log4j/2.x/security.html", source: "duplicate", tags: [] },
        ],
      },
    },
  ],
};

test("cve: identifiers are trimmed, uppercased and validated", () => {
  assert.equal(normalizeCveId(" cve-2021-44228 "), "CVE-2021-44228");
  assert.equal(normalizeCveId("CVE-2021-44228"), "CVE-2021-44228");
  assert.equal(normalizeCveId("CVE-2021-1234"), "CVE-2021-1234");
});

test("cve: malformed and out-of-range identifiers are rejected", () => {
  for (const value of [
    "",
    "CVE-21-44228",
    "CVE-2021-123",
    "CVE-2021-12345678",
    "CVE-1998-1234",
    "CVE-2021-ABCD",
    "2021-44228",
    "CVE-2021-44228<script>",
  ]) {
    assert.equal(normalizeCveId(value), null, `expected null for ${JSON.stringify(value)}`);
  }
});

test("cve: detail URLs fall back to the NVD search for invalid input", () => {
  assert.equal(
    cveDetailUrl("CVE-2021-44228"),
    "https://nvd.nist.gov/vuln/detail/CVE-2021-44228",
  );
  assert.equal(cveDetailUrl("nonsense"), "https://nvd.nist.gov/vuln/search");
});

test("cve: severity thresholds follow the CVSS ranges", () => {
  assert.equal(severityFromScore(null), "UNKNOWN");
  assert.equal(severityFromScore(0), "NONE");
  assert.equal(severityFromScore(3.9), "LOW");
  assert.equal(severityFromScore(4), "MEDIUM");
  assert.equal(severityFromScore(6.9), "MEDIUM");
  assert.equal(severityFromScore(7), "HIGH");
  assert.equal(severityFromScore(8.9), "HIGH");
  assert.equal(severityFromScore(9), "CRITICAL");
  assert.equal(severityFromScore(Number.NaN), "UNKNOWN");
});

test("cve: a zero score is rendered as 0.0, not as missing data", () => {
  assert.equal(formatCvssScore(0), "0.0");
  assert.equal(formatCvssScore(10), "10.0");
  assert.equal(formatCvssScore(null), "Not scored");
});

test("cve: a full NVD record is normalised", () => {
  const record = normalizeNvdResponse(PAYLOAD, "CVE-2021-44228");
  assert.ok(record);
  assert.equal(record.id, "CVE-2021-44228");
  assert.equal(record.status, "Analyzed");
  assert.equal(record.published, "2021-12-10T10:15:09.143Z");
  assert.match(record.description ?? "", /^Apache Log4j2/);
  assert.equal(record.sourceUrl, "https://nvd.nist.gov/vuln/detail/CVE-2021-44228");

  const metric = primaryMetric(record);
  assert.ok(metric);
  assert.equal(metric.version, "3.1");
  assert.equal(metric.severity, "CRITICAL");
  assert.equal(metric.score, 10);

  // Primary v3.1 sorts before v2.
  assert.deepEqual(
    record.metrics.map((entry) => entry.version),
    ["3.1", "2.0"],
  );
});

test("cve: the v2 severity lives on the metric, not inside cvssData", () => {
  const record = normalizeNvdResponse(PAYLOAD, "CVE-2021-44228");
  const v2 = record?.metrics.find((metric) => metric.version === "2.0");
  assert.equal(v2?.severity, "HIGH");
  assert.equal(v2?.score, 9.3);
});

test("cve: only CWE identifiers are kept as weaknesses", () => {
  const record = normalizeNvdResponse(PAYLOAD, "CVE-2021-44228");
  assert.deepEqual(record?.weaknesses, ["CWE-502", "CWE-400"]);
});

test("cve: affected products come from vulnerable CPEs, including nested nodes", () => {
  const record = normalizeNvdResponse(PAYLOAD, "CVE-2021-44228");
  assert.ok(record);
  assert.equal(record.affected.length, 2);

  const ranged = record.affected.find((product) => product.range);
  assert.equal(ranged?.vendor, "apache");
  assert.equal(ranged?.product, "log4j");
  assert.equal(ranged?.range, "<= 2.15.0");

  const beta = record.affected.find((product) => product.version === "2.0 beta9");
  assert.ok(beta);
});

test("cve: non-http references are dropped and duplicates removed", () => {
  const record = normalizeNvdResponse(PAYLOAD, "CVE-2021-44228");
  assert.deepEqual(record?.references, [
    {
      url: "https://logging.apache.org/log4j/2.x/security.html",
      source: "vendor",
      tags: ["Vendor Advisory"],
    },
  ]);
});

test("cve: an empty result set is reported as not found", () => {
  assert.equal(
    normalizeNvdResponse({ totalResults: 0, vulnerabilities: [] }, "CVE-2021-44228"),
    null,
  );
});

test("cve: malformed payloads return null instead of throwing", () => {
  for (const payload of [null, undefined, 42, "text", [], {}, { vulnerabilities: "no" }]) {
    assert.equal(normalizeNvdResponse(payload, "CVE-2021-44228"), null);
  }
});

test("cve: a record with an invalid id is rejected", () => {
  const payload = {
    vulnerabilities: [{ cve: { id: "<script>", descriptions: [] } }],
  };
  assert.equal(normalizeNvdResponse(payload, "CVE-2021-44228"), null);
});

test("cve: the requested identifier wins when several are returned", () => {
  const payload = {
    vulnerabilities: [
      { cve: { id: "CVE-2020-0001", descriptions: [{ lang: "en", value: "first" }] } },
      { cve: { id: "CVE-2020-0002", descriptions: [{ lang: "en", value: "second" }] } },
    ],
  };
  const record = normalizeNvdResponse(payload, "CVE-2020-0002");
  assert.equal(record?.id, "CVE-2020-0002");
  assert.equal(record?.description, "second");
});

test("cve: control characters are stripped from descriptions", () => {
  const payload = {
    vulnerabilities: [
      {
        cve: {
          id: "CVE-2020-0003",
          descriptions: [{ lang: "en", value: "safe\u0000text\u0007 here" }],
        },
      },
    ],
  };
  const record = normalizeNvdResponse(payload, "CVE-2020-0003");
  assert.equal(record?.description, "safetext here");
});

test("cve: the compact record survives a round trip through the validator", () => {
  const record = normalizeNvdResponse(PAYLOAD, "CVE-2021-44228");
  assert.ok(record);
  assert.deepEqual(parseCveRecord(record, "CVE-2021-44228"), record);
});

test("cve: a compact record for another identifier is rejected", () => {
  const record = normalizeNvdResponse(PAYLOAD, "CVE-2021-44228");
  assert.equal(parseCveRecord(record, "CVE-2022-0001"), null);
});

test("cve: malformed compact records are rejected", () => {
  for (const payload of [null, undefined, 42, "text", [], {}, { id: "<script>" }]) {
    assert.equal(parseCveRecord(payload, "CVE-2021-44228"), null);
  }
});

test("cve: a compact record with junk fields is sanitised, not rendered raw", () => {
  const parsed = parseCveRecord(
    {
      id: "CVE-2021-44228",
      status: "Analyzed",
      published: "2021-12-10T10:15:09.143",
      description: "  A description.  ",
      metrics: [
        { version: "3.1", type: "Primary", score: 10, severity: "CRITICAL", vector: "CVSS:3.1/..." },
        { version: "", type: "Primary" },
        "nonsense",
      ],
      weaknesses: ["CWE-502", "not-a-cwe", 42],
      affected: [{ vendor: "apache", product: "log4j", version: null, range: "<= 2.15.0" }, {}],
      references: [
        { url: "https://example.com/advisory", source: "vendor", tags: ["Vendor Advisory"] },
        { url: "javascript:alert(1)", source: "bad", tags: [] },
      ],
      sourceUrl: "javascript:alert(1)",
    },
    "CVE-2021-44228",
  );

  assert.ok(parsed);
  assert.equal(parsed.published, "2021-12-10T10:15:09.143Z");
  assert.equal(parsed.description, "A description.");
  assert.equal(parsed.metrics.length, 1);
  assert.equal(parsed.metrics[0].score, 10);
  assert.deepEqual(parsed.weaknesses, ["CWE-502"]);
  assert.equal(parsed.affected.length, 1);
  assert.equal(parsed.references.length, 1);
  assert.equal(parsed.sourceUrl, "https://nvd.nist.gov/vuln/detail/CVE-2021-44228");
});

test("cve: an unknown severity falls back to the score", () => {
  const parsed = parseCveRecord(
    {
      id: "CVE-2021-44228",
      metrics: [{ version: "3.1", type: "Primary", score: 5.5, severity: "green" }],
    },
    "CVE-2021-44228",
  );
  assert.equal(parsed?.metrics[0].severity, "MEDIUM");
});
