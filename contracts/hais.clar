(impl-trait .tradables.tradables-trait)

(define-map hais {hai-id: uint}
  {name: (string-ascii 20),
  last-renewal: uint,
  image: uint,
  date-of-birth: uint}
)

{name: "text", last-renewal: "block-height", image: "number-index", date-of-birth: "block-height"}
(define-read-only (get-meta-data (hai-id uint))
    (map-get? hais {hai-id: hai-id})
)

(define-non-fungible-token nft-hais uint)
(define-data-var next-id uint u1)
(define-constant -tolerance u86400) ;; 1 day in seconds

(define-constant err-hai-unborn u10)
(define-constant err-hai-exists u20)
(define-constant err-hai-expired u30)
(define-constant err-transfer-not-allowed u40)
(define-constant err-transfer-failed u50)

(define-private (get-time)
   (unwrap-panic (get-block-info? time (- block-height u1)))
)

(define-private (is-last-renewal-young (last-renewal uint))
  (> (to-int last-renewal) (to-int (- (get-time) expiry-tolerance)))
)

{action: "create"}
(define-public (create-hai (name (string-ascii 20)) (image uint))
    (let ((hai-id (var-get next-id)))
      (if (is-ok (nft-mint? nft-hais hai-id tx-sender))
        (begin
          (var-set next-id (+ hai-id u1))
          (map-set hais {hai-id: hai-id}
          {
            name: name,
            last-renewal: (get-time),
            image: image,
            date-of-birth: (get-time)
          }
          )
          (ok hai-id)
        )
        (err err-hai-exists)
    )
  )
)

{control: "button"}
(define-public (renew-hai (hai-id uint))
  (match (map-get? hais {hai-id: hai-id})
    hai (let ((last-renewal (get-time)))
        (if (is-last-renewal-young (get last-renewal hai))
          (begin
           (map-set hais {hai-id: hai-id} {
              name: (get name hai),
              last-renewal: last-renewal,
              image: (get image hai),
              date-of-birth: (get date-of-birth hai)
              }
            )
            (ok block-height)
          )
          (err err-hai-expired)
        )
      )
    (err err-hai-unborn)
  )
)

{action: "transfer"}
(define-public (transfer? (hai-id uint) (sender principal) (recipient principal))
  (let ((owner (unwrap! (get-owner? hai-id) (err err-hai-unborn))))
    (if (is-eq owner sender)
      (match (nft-transfer? nft-hais hai-id sender recipient)
        success (ok true)
        error (err (+ err-transfer-failed error))
      )
      (err err-transfer-not-allowed)
    )
  )
)

(define-read-only (last-hai-id)
   (- (var-get next-id) u1)
)

(define-read-only (get-owner? (hai-id uint))
  (match (nft-get-owner? nft-hais hai-id)
    owner (ok owner)
    (err err-hai-unborn)
  )
)

(define-read-only (is-alive (hai-id uint))
  (match (map-get? hais {hai-id: hai-id})
    hai (ok (is-last-renewal-young (get last-renewal hai)))
    (err err-hai-unborn)
  )
)

