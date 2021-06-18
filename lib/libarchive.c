#define LIBARCHIVE_STATIC
#include <archive.h>
#include <archive_entry.h>
#include <emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

EMSCRIPTEN_KEEPALIVE
const void *archive_read_new_memory(const void *buf, size_t size,
                                    const char *passphrase) {
  struct archive *a;
  a = archive_read_new();
  if (archive_read_support_filter_all(a) != ARCHIVE_OK)
    return NULL;
  if (archive_read_support_format_all(a) != ARCHIVE_OK)
    return NULL;
  if (passphrase && archive_read_add_passphrase(a, passphrase) != ARCHIVE_OK)
    return NULL;
  if (archive_read_open_memory(a, buf, size) != ARCHIVE_OK)
    return NULL;
  return a;
}

EMSCRIPTEN_KEEPALIVE
const void *archive_read_next_entry(void *archive) {
  struct archive_entry *entry;
  if (archive_read_next_header(archive, &entry) != ARCHIVE_OK)
    return NULL;
  return entry;
}
