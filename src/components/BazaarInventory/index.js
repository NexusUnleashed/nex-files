import { Fragment, useState } from "react";
import Heading from "@theme/Heading";
import bazaarItems from "@site/docs/bazaar/items1000.json";

import styles from "./styles.module.css";

const MERCHANT_FALLBACK = "Merchant Unspecified";
const PRICE_FALLBACK = "Unlisted";
const EMPTY_VALUE = "Not recorded";
const numberFormatter = new Intl.NumberFormat("en-US");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeResponse(response) {
  if (Array.isArray(response)) {
    return response.map((entry) => normalizeText(entry)).filter(Boolean).join("\n");
  }

  return normalizeText(response);
}

function hasInteractionContent(interaction) {
  return Boolean(
    normalizeText(interaction?.command) ||
      normalizeResponse(interaction?.response) ||
      normalizeText(interaction?.notes)
  );
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeItem(item, index) {
  const name = normalizeText(item?.name);
  const merchant = normalizeText(item?.source?.merchant) || MERCHANT_FALLBACK;
  const shortName = normalizeText(item?.shortName);
  const description = normalizeText(item?.description);
  const notes = normalizeText(item?.notes);
  const price = Number.isFinite(item?.source?.price) ? item.source.price : null;
  const tags = Array.isArray(item?.tags)
    ? item.tags.map((tag) => normalizeText(tag)).filter(Boolean)
    : [];
  const interactions = Array.isArray(item?.interactions)
    ? item.interactions
        .filter((interaction) => hasInteractionContent(interaction))
        .map((interaction) => ({
          command: normalizeText(interaction?.command),
          response: normalizeResponse(interaction?.response),
          notes: normalizeText(interaction?.notes),
        }))
    : [];

  return {
    index,
    id: `${slugify(merchant || MERCHANT_FALLBACK)}-${slugify(name || shortName || `item-${index + 1}`)}-${index + 1}`,
    name,
    shortName,
    description,
    notes,
    merchant,
    price,
    tags,
    interactions,
  };
}

function sortMerchantGroups(groupA, groupB) {
  if (groupA.merchant === MERCHANT_FALLBACK) {
    return 1;
  }

  if (groupB.merchant === MERCHANT_FALLBACK) {
    return -1;
  }

  return groupA.merchant.localeCompare(groupB.merchant);
}

function formatPrice(price) {
  return typeof price === "number" ? numberFormatter.format(price) : PRICE_FALLBACK;
}

const inventoryItems = Array.isArray(bazaarItems)
  ? bazaarItems.map((item, index) => normalizeItem(item, index)).filter((item) => item.name)
  : [];

const merchantGroups = Array.from(
  inventoryItems.reduce((groups, item) => {
    if (!groups.has(item.merchant)) {
      groups.set(item.merchant, []);
    }

    groups.get(item.merchant).push(item);
    return groups;
  }, new Map())
)
  .map(([merchant, items]) => ({
    merchant,
    anchorId: `merchant-${slugify(merchant) || "unspecified"}`,
    itemCount: items.length,
    pricedItemCount: items.filter((item) => item.price !== null).length,
    items,
  }))
  .sort(sortMerchantGroups);

const incompleteItemCount = inventoryItems.filter(
  (item) => item.merchant === MERCHANT_FALLBACK || item.price === null
).length;

function renderTextBlock(value, fallback = EMPTY_VALUE) {
  return value ? <div className={styles.preWrap}>{value}</div> : <span className={styles.muted}>{fallback}</span>;
}

export default function BazaarInventory() {
  const [openItemId, setOpenItemId] = useState(null);

  if (!inventoryItems.length) {
    return <p>No Bazaar items are available yet.</p>;
  }

  return (
    <div className={styles.inventoryPage}>
      <section className={styles.summaryGrid} aria-label="Bazaar inventory summary">
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Items</span>
          <strong className={styles.summaryValue}>{numberFormatter.format(inventoryItems.length)}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Merchants</span>
          <strong className={styles.summaryValue}>{numberFormatter.format(merchantGroups.length)}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Needs Metadata</span>
          <strong className={styles.summaryValue}>{numberFormatter.format(incompleteItemCount)}</strong>
        </article>
      </section>

      {incompleteItemCount > 0 ? (
        <p className={styles.notice}>
          {numberFormatter.format(incompleteItemCount)} item{incompleteItemCount === 1 ? "" : "s"} are missing a
          merchant or price and are listed under <strong>{MERCHANT_FALLBACK}</strong> with an{" "}
          <strong>{PRICE_FALLBACK}</strong> price.
        </p>
      ) : null}

      <nav className={styles.merchantNav} aria-label="Merchant quick links">
        {merchantGroups.map((group) => (
          <a key={group.anchorId} className={styles.merchantPill} href={`#${group.anchorId}`}>
            {group.merchant}
          </a>
        ))}
      </nav>

      {merchantGroups.map((group) => (
        <section key={group.anchorId} id={group.anchorId} className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <Heading as="h2" className={styles.sectionTitle}>
                {group.merchant}
              </Heading>
              <p className={styles.sectionMeta}>
                {numberFormatter.format(group.itemCount)} items | {numberFormatter.format(group.pricedItemCount)} priced
              </p>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.itemTable}>
              <colgroup>
                <col className={styles.itemColumn} />
                <col className={styles.priceColumn} />
                <col className={styles.tagsColumn} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Price</th>
                  <th scope="col">Tags</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item) => {
                  const isOpen = openItemId === item.id;

                  return (
                    <Fragment key={item.id}>
                      <tr className={isOpen ? styles.itemRowOpen : undefined}>
                        <td className={styles.itemCell}>
                          <button
                            type="button"
                            className={styles.itemButton}
                            aria-expanded={isOpen}
                            aria-controls={`${item.id}-details`}
                            onClick={() => setOpenItemId(isOpen ? null : item.id)}
                          >
                            <span className={styles.itemName}>{item.name}</span>
                            {item.shortName && item.shortName !== item.name ? (
                              <span className={styles.shortName}>Short name: {item.shortName}</span>
                            ) : null}
                          </button>
                        </td>
                        <td className={styles.priceCell}>{formatPrice(item.price)}</td>
                        <td className={styles.tagsCell}>
                          {item.tags.length ? (
                            <span className={styles.tagList}>
                              {item.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className={styles.muted}>{EMPTY_VALUE}</span>
                          )}
                        </td>
                      </tr>

                      {isOpen ? (
                        <tr className={styles.detailRow}>
                          <td id={`${item.id}-details`} colSpan={3} className={styles.detailRowCell}>
                            <table className={styles.detailTable}>
                              <tbody>
                                <tr>
                                  <th scope="row">Description</th>
                                  <td>{renderTextBlock(item.description)}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Notes</th>
                                  <td>{renderTextBlock(item.notes)}</td>
                                </tr>
                              </tbody>
                            </table>

                            <section className={styles.interactionsBlock} aria-label={`${item.name} interactions`}>
                              <div className={styles.sectionLabel}>Interactions</div>
                              {item.interactions.length ? (
                                <table className={styles.interactionTable}>
                                  <thead>
                                    <tr>
                                      <th scope="col">Command</th>
                                      <th scope="col">Response</th>
                                      <th scope="col">Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.interactions.map((interaction, interactionIndex) => (
                                      <tr key={`${item.id}-interaction-${interactionIndex + 1}`}>
                                        <td>{interaction.command || EMPTY_VALUE}</td>
                                        <td>{renderTextBlock(interaction.response)}</td>
                                        <td>{renderTextBlock(interaction.notes)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className={styles.emptyState}>No recorded interactions yet.</p>
                              )}
                            </section>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
