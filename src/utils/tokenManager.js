const tokenManager = {
    revokedTokens: new map(),
    add(tokenId, expiresAt) {
        this.revokedTokens.set(tokenId, expiresAt)
        this.cleanUp()
    },

    isRevoked(tokenId) {
        return this.revokedTokens.has(tokenId)
    },

    cleanup() {
        const now = Date.now()
        for (const [tokenId, expiresAt] of this.revokedTokens) {
            if (expiresAt < now) {
                this.revokedTokens.delete(tokenId)
            }
        }
    }
}